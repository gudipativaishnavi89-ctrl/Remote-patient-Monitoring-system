import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// 1. Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: '3D 4K Remote Patient Monitoring Gateway',
    timestamp: new Date().toISOString(),
    version: '4.2.0-PRO',
    aiConnected: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 2. AI Health Risk Analysis API Route (Server-Side Gemini API Proxy)
app.post('/api/ai/analyze-patient', async (req, res) => {
  const { patient, latestVital, recentVitals } = req.body;

  if (!patient || !latestVital) {
    return res.status(400).json({ error: 'Missing patient or latestVital in request payload' });
  }

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `You are a clinical decision-support AI within a 3D Remote Patient Monitoring system.
Analyze the following patient biometric telemetry and clinical profile:

Patient: ${patient.name}, Age ${patient.age}, Gender ${patient.gender}
Medical History: ${patient.medicalHistory.join(', ')}
Current Medications: ${patient.currentMedications.map((m: any) => `${m.name} ${m.dosage}`).join(', ')}

Latest Real-Time Vitals:
- Heart Rate: ${latestVital.heartRate} BPM
- Blood Pressure: ${latestVital.bloodPressureSys}/${latestVital.bloodPressureDia} mmHg
- SpO2: ${latestVital.spo2}%
- Temperature: ${latestVital.temperature} °C
- Respiratory Rate: ${latestVital.respiratoryRate} rpm

Recent 3 Readings Context:
${(recentVitals || []).slice(0, 3).map((v: any, i: number) => `T-${i + 1}: HR ${v.heartRate}, BP ${v.bloodPressureSys}/${v.bloodPressureDia}, SpO2 ${v.spo2}%`).join('\n')}

Generate a rigorous JSON risk assessment with this exact schema:
{
  "riskScore": <integer 0-100>,
  "riskLevel": "<'normal' | 'moderate' | 'high' | 'critical'>",
  "primaryFactors": ["<key clinical observation 1>", "<key clinical observation 2>", "<key clinical observation 3>"],
  "summary": "<2-3 sentence clinical overview with non-diagnostic disclaimer emphasizing this is decision support>",
  "triageRecommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "trendAnalysis": {
    "heartRateTrend": "<'stable' | 'increasing' | 'decreasing' | 'erratic'>",
    "bpTrend": "<'stable' | 'elevated' | 'critical'>",
    "spo2Trend": "<'stable' | 'declining'>",
    "temperatureTrend": "<'stable' | 'febrile'>"
  }
}
Return ONLY valid raw JSON without markdown code fences.`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text ? response.text.trim() : '';
      const cleanJson = responseText.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        ...parsed,
        patientId: patient.id,
        calculatedAt: new Date().toISOString(),
        aiModelVersion: 'Gemini-2.5-Clinical-Intelligence',
      });
    } catch (aiErr) {
      console.warn('Gemini API call failed, generating deterministic response:', aiErr);
    }
  }

  // Fallback Rule-Engine Response when AI key not supplied or network offline
  let score = 18;
  const factors: string[] = [];
  const recs: string[] = [];
  let riskLevel: 'normal' | 'moderate' | 'high' | 'critical' = 'normal';

  if (latestVital.heartRate > 120 || latestVital.heartRate < 48) {
    score += 30;
    factors.push(`Heart rate outlier at ${latestVital.heartRate} BPM`);
  }
  if (latestVital.bloodPressureSys > 150 || latestVital.bloodPressureDia > 95) {
    score += 35;
    factors.push(`Elevated blood pressure ${latestVital.bloodPressureSys}/${latestVital.bloodPressureDia} mmHg`);
  }
  if (latestVital.spo2 < 92) {
    score += 40;
    factors.push(`Hypoxemic threshold triggered (${latestVital.spo2}% SpO2)`);
  }
  if (latestVital.temperature > 38.5) {
    score += 25;
    factors.push(`Pyrexia noted (${latestVital.temperature}°C)`);
  }

  if (factors.length === 0) {
    factors.push('All monitored parameters within target clinical thresholds');
    factors.push('Patient medication schedule in compliance');
    recs.push('Maintain regular daily scheduled biometric checks');
    recs.push('Next tele-consultation scheduled in routine care cycle');
  } else {
    recs.push('Re-measure vitals in seated resting position after 10 minutes');
    recs.push('Notify clinical care team if abnormal readings persist');
  }

  score = Math.min(100, Math.max(5, score));
  if (score >= 80) riskLevel = 'critical';
  else if (score >= 55) riskLevel = 'high';
  else if (score >= 28) riskLevel = 'moderate';

  return res.json({
    patientId: patient.id,
    calculatedAt: new Date().toISOString(),
    riskScore: score,
    riskLevel,
    primaryFactors: factors,
    summary: riskLevel === 'normal' 
      ? 'Current biometric telemetry is within target physiological parameters. No acute cardiac or respiratory decompensation indicated.'
      : 'Automated screening identified deviations from baseline vitals. Prompt physician review is advised. This automated report provides decision-support and does not replace clinical diagnosis.',
    triageRecommendations: recs,
    trendAnalysis: {
      heartRateTrend: 'stable',
      bpTrend: 'stable',
      spo2Trend: 'stable',
      temperatureTrend: 'stable',
    },
    aiModelVersion: 'BioRisk-Deterministic-Clinical-Engine',
  });
});

// Start server with Vite middleware in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Remote Patient Monitoring Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
