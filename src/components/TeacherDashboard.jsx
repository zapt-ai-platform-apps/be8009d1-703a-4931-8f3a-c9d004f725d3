import { createSignal, onMount, Show } from 'solid-js';
import { supabase, createEvent } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function TeacherDashboard() {
  const [texts, setTexts] = createSignal([]);
  const [newText, setNewText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [showCamera, setShowCamera] = createSignal(false);
  let videoRef;
  const navigate = useNavigate();

  const fetchTexts = async () => {
    const { data, error } = await supabase.from('texts').select('*').order('created_at', { ascending: false });
    if (data) {
      setTexts(data);
    } else {
      console.error(error);
    }
  };

  onMount(() => {
    fetchTexts();
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUploadText = async () => {
    setShowCamera(true);
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef) {
        videoRef.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef && videoRef.srcObject) {
      let tracks = videoRef.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      processOCR(imageDataUrl);
      setShowCamera(false);
      stopCamera();
    }
  };

  const processOCR = async (imageDataUrl) => {
    setLoading(true);
    try {
      const result = await createEvent('ocr_request', {
        image: imageDataUrl
      });
      setNewText(result.text || '');
    } catch (error) {
      console.error('Error during OCR processing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveText = async () => {
    const { data, error } = await supabase.from('texts').insert([{ content: newText() }]);
    if (data) {
      setNewText('');
      fetchTexts();
    } else {
      console.error(error);
    }
  };

  const handleDeleteText = async (id) => {
    const { data, error } = await supabase.from('texts').delete().eq('id', id);
    if (data) {
      fetchTexts();
    } else {
      console.error(error);
    }
  };

  return (
    <div class="min-h-screen p-4 h-full">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-purple-600">Teacher Dashboard</h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Upload New Text</h2>
          <button
            onClick={handleUploadText}
            class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading()}
          >
            <Show when={!showCamera()} fallback="Processing...">
              Capture Text from Camera
            </Show>
          </button>
          <Show when={showCamera()}>
            <div class="mt-4">
              <video ref={el => videoRef = el} autoplay class="w-full h-64 bg-black rounded-lg"></video>
              <button
                onClick={captureImage}
                class="mt-2 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                Capture and Process
              </button>
              <button
                onClick={() => { setShowCamera(false); stopCamera(); }}
                class="mt-2 w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </Show>
          <Show when={newText()}>
            <div class="mt-4">
              <textarea
                value={newText()}
                onInput={(e) => setNewText(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                rows="6"
              ></textarea>
              <button
                onClick={handleSaveText}
                class="mt-2 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                Save Text
              </button>
            </div>
          </Show>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Texts</h2>
          <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
            <For each={texts()}>
              {(text) => (
                <div class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <p class="text-gray-700">{text.content}</p>
                  <button
                    class="ml-4 text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={() => handleDeleteText(text.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;