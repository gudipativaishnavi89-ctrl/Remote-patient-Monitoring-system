# Android APK Build Workflow Guide (GitHub Actions)

This repository includes an automated GitHub Actions CI/CD workflow to generate an installable **Android APK** directly from the codebase.

---

## 🚀 How It Works

1. **Capacitor Integration**: The project uses `@capacitor/core` and `@capacitor/android` configured in `capacitor.config.json`.
2. **GitHub Actions Workflow**: Configured in `.github/workflows/build-android-apk.yml`.
3. **Artifact Output**: The workflow builds `AURA-RPM-debug.apk` (or Release APK) and uploads it to GitHub Actions Artifacts for download.

---

## 🛠️ Triggering the APK Build in GitHub

### Option A: Automatic Trigger
- Whenever you push code to `main` or `master` branch or open a pull request, the APK build will start automatically.

### Option B: Manual Trigger (One-Click)
1. Go to your repository on GitHub.
2. Click on the **Actions** tab.
3. Select **"Build Android APK"** from the left sidebar.
4. Click **"Run workflow"**, choose the branch and build type (`debug` or `release`), and click **Run workflow**.

---

## 📥 Downloading the Generated APK

1. When the workflow run finishes (usually in 2-3 minutes), click on the completed run.
2. Scroll down to the **Artifacts** section at the bottom of the summary page.
3. Click on **`AURA-RPM-Android-APK`** to download the zip containing your installable `.apk` file.
4. Transfer the `.apk` to any Android device, enable *"Install from Unknown Sources"* if prompted, and install.

---

## 💻 Local Android Development (Optional)

If you have Android Studio installed locally:

```bash
# 1. Build web assets & sync to Android project
npm run build:android

# 2. Open project in Android Studio
npm run cap:open
```
