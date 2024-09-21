const express = require('express');
const Replicate = require('replicate');
require('dotenv').config();

const app = express();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY // Add this line
});
console.log('Replicate API Token:', process.env.REPLICATE_API_KEY);
console.log('Current working directory:', process.cwd()); // Log current directory
console.log('Environment Variables:', process.env);

// Serve static files from the root directory
app.use(express.static(__dirname)); // This serves files from the root directory

app.use(express.json({ limit: '10mb' }));

app.post('/generate', async (req, res) => {
  try {
    const { image, prompt, style } = req.body;

    const input = {
      input_image: image,
      prompt: prompt + " img",
      style_name: style,
      num_steps: 50,
      num_outputs: 1
    };

    const output = await replicate.run(
      "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      { input }
    );

    res.json({ imageUrl: output[0] });
  } catch (error) {
    console.error('Error:', error); // Log the error details
    res.status(500).json({ error: 'An error occurred', details: error.message }); // Include error details in the response
  }
});

// Serve the main HTML page from the root directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Adjusted path to point to the root directory
});

const port = 3000;
// Add this near the end of your index.js file, before app.listen()
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});