const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const generateBtn = document.getElementById("generateBtn");
const outputImage = document.getElementById("outputImage");
const shutterSound = new Audio("camera-shutter.mp3");
const loadingSpinner = document.getElementById("loadingSpinner");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const confirmBtn = document.getElementById("confirmBtn");
const retakeBtn = document.getElementById("retakeBtn");
const downloadContainer = document.getElementById("downloadContainer");
const downloadBtn = document.getElementById("downloadBtn");
const cameraContainer = document.getElementById("cameraContainer");
const startOverBtn = document.getElementById("startOverBtn");

let capturedImage = null;

async function setupCamera() {
    try {
        console.log("Attempting to access camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        video.srcObject = stream;
        console.log("Camera access successful");

        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                console.log("Video metadata loaded");
                video
                    .play()
                    .then(() => {
                        console.log("Video playback started");
                        resolve();
                    })
                    .catch((error) => {
                        console.error("Error starting video playback:", error);
                    });
            };
        });
    } catch (error) {
        console.error("Error accessing the camera:", error);
        alert("Unable to access the camera. Error: " + error.message);
    }
}

async function initializeApp() {
    await setupCamera();
    resetUIState();
}

function resetUIState() {
    video.style.display = "block";
    captureBtn.style.display = "block";
    captureBtn.disabled = false;
    generateBtn.disabled = true;
    outputImage.style.display = "none";
    downloadContainer.style.display = "none";
    previewContainer.style.display = "none";
    cameraContainer.style.display = "block";
    loadingSpinner.style.display = "none";

    // Remove any added images
    const addedImage = cameraContainer.querySelector("img");
    if (addedImage) {
        cameraContainer.removeChild(addedImage);
    }
}

async function resetApp() {
    // Stop all video tracks
    if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
    }

    // Clear video source
    video.srcObject = null;

    capturedImage = null;

    // Reset UI state
    resetUIState();

    // Reinitialize the camera
    await setupCamera();
}

document.addEventListener("DOMContentLoaded", initializeApp);
startOverBtn.addEventListener("click", resetApp);

captureBtn.addEventListener("click", () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        capturedImage = canvas.toDataURL("image/jpeg");

        shutterSound.play().catch((error) => {
            console.error("Error playing shutter sound:", error);
        });

        video.style.animation = "flash 0.5s";
        setTimeout(() => {
            video.style.animation = "";
        }, 500);

        previewImage.src = capturedImage;
        previewContainer.style.display = "block";
        cameraContainer.style.display = "none";
    } else {
        console.error("Video not ready");
        alert("Video stream not ready. Please try again in a moment.");
    }
});

confirmBtn.addEventListener("click", () => {
    previewContainer.style.display = "none";
    cameraContainer.style.display = "block";
    video.style.display = "none";
    captureBtn.style.display = "none"; // Hide the "Take Selfie" button
    const confirmedImage = document.createElement("img");
    confirmedImage.src = capturedImage;
    confirmedImage.style.width = "100%";
    confirmedImage.style.height = "auto";
    cameraContainer.appendChild(confirmedImage);
    generateBtn.disabled = false;
});

retakeBtn.addEventListener("click", () => {
    previewContainer.style.display = "none";
    cameraContainer.style.display = "block";
    video.style.display = "block";
    captureBtn.style.display = "block"; // Show the "Take Selfie" button
    capturedImage = null;
});

generateBtn.addEventListener("click", async () => {
    if (!capturedImage) {
        console.error("No image captured");
        alert("Please capture an image first.");
        return;
    }

    generateBtn.disabled = true;
    loadingSpinner.style.display = "block";

    const locationPrompt = document.getElementById("locationPrompt").value;
    const characterPrompt = document.getElementById("characterPrompt").value;
    const stylePrompt = document.getElementById("stylePrompt").value;

    const prompt = `A photo of a person ${characterPrompt} ${locationPrompt}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: capturedImage,
                prompt: prompt,
                style: stylePrompt,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        outputImage.src = data.imageUrl;
        outputImage.style.display = "block";
        cameraContainer.style.display = "none";

        // Enable download
        downloadContainer.style.display = "block";
    } catch (error) {
        console.error("Error:", error);
        if (error.name === "AbortError") {
            alert("The request took too long. Please try again.");
        } else {
            alert(
                "An error occurred while generating the image. Please try again.",
            );
        }
    } finally {
        generateBtn.disabled = false;
        loadingSpinner.style.display = "none";
    }
});

downloadBtn.addEventListener("click", async () => {
    try {
        // Fetch the image as a blob
        const response = await fetch(outputImage.src);
        const blob = await response.blob();

        // Use the showSaveFilePicker API
        const handle = await window.showSaveFilePicker({
            suggestedName: "generated-image.jpg",
            types: [
                {
                    description: "JPEG Image",
                    accept: { "image/jpeg": [".jpg", ".jpeg"] },
                },
            ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

        alert("Image saved successfully!");
        await resetApp(); // Use await here to ensure camera is set up before continuing
    } catch (err) {
        console.error("Error saving the file:", err);
        alert("There was an error saving the file. Please try again.");
    }
});
