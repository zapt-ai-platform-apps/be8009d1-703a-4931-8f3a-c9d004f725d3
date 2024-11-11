import { createSignal, onMount, Show } from 'solid-js';
import { supabase, createEvent } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function TeacherDashboard() {
  const [texts, setTexts] = createSignal([]);
  const [newText, setNewText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
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
    // Logic to capture image from camera
    // Since capturing from camera is typically handled in the frontend,
    // we'll assume we have a function to get the image blob.

    // Placeholder for image capture logic
    const imageBlob = await captureImageFromCamera();

    setLoading(true);
    try {
      const ocrResult = await createEvent('ocr_request', {
        image: imageBlob
      });
      setNewText(ocrResult.text);
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
    <div class="h-full p-4">
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
            <Show when={loading()} fallback="Capture Text from Camera">
              Processing...
            </Show>
          </button>
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