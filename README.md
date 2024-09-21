# PhotoMaker Selfie Studio

PhotoMaker Selfie Studio is a web application that allows users to take selfies and generate artistic images based on user-selected prompts. The application utilizes the Replicate API to create unique images based on the captured selfies and user-defined styles and locations.

## Features

- Capture selfies using the device's camera.
- Select various prompts for location, character, and style.
- Generate artistic images based on the captured selfie and selected prompts.
- Download the generated images.
- Responsive design for a seamless user experience.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **API**: Replicate API for image generation
- **Environment Variables**: Managed using dotenv

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ronen9/PhotoMoment.git
   cd PhotoMoment
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Replicate API key:

   ```
   REPLICATE_API_KEY=your_api_key_here
   ```

### Running the Application

1. Start the server:

   ```bash
   npm start
   ```

2. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Usage

1. Click the "Take Selfie" button to capture an image using your device's camera.
2. Select a location, character, and style from the dropdown menus.
3. Click the "Generate Masterpiece" button to create an artistic image based on your selfie and selected prompts.
4. Once the image is generated, you can download it by clicking the "Download Image" button.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Replicate API](https://replicate.com/) for providing the image generation service.
- [Express](https://expressjs.com/) for the backend framework.
- [Font Awesome](https://fontawesome.com/) for the icons used in the application.
