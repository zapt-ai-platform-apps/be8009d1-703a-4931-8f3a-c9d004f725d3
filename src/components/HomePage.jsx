function HomePage() {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-purple-600 mb-4">Welcome to New App</h1>
        <p class="text-xl text-gray-700 mb-8">
          Assisting students in reading fluency through interactive TTS and phrase-highlighting.
        </p>
        <a
          href="/login"
          class="px-8 py-4 bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}

export default HomePage;