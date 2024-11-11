import { createSignal, onMount, Show, For } from 'solid-js';
import { supabase, createEvent } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function StudentDashboard() {
  const [texts, setTexts] = createSignal([]);
  const [selectedText, setSelectedText] = createSignal(null);
  const [audioUrl, setAudioUrl] = createSignal('');
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

  const handleTextToSpeech = async () => {
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: selectedText().content
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPhrase = async (phrase) => {
    try {
      const result = await createEvent('text_to_speech', {
        text: phrase
      });
      const audio = new Audio(result);
      audio.play();
    } catch (error) {
      console.error('Error playing phrase:', error);
    }
  };

  return (
    <div class="min-h-screen p-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-purple-600">Student Dashboard</h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Available Texts</h2>
          <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
            <For each={texts()}>
              {(text) => (
                <div
                  class="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-purple-100"
                  onClick={() => setSelectedText(text)}
                >
                  <p class="text-gray-700">{text.content.slice(0, 100)}...</p>
                </div>
              )}
            </For>
          </div>
        </div>
        <Show when={selectedText()}>
          <div>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Read Text</h2>
            <div class="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
              <div class="flex-1 overflow-y-auto">
                <For each={selectedText().content.split('. ')}>
                  {(phrase) => (
                    <p
                      class="my-2 cursor-pointer hover:text-purple-600"
                      onClick={() => handlePlayPhrase(phrase)}
                    >
                      {phrase}.
                    </p>
                  )}
                </For>
              </div>
              <button
                onClick={handleTextToSpeech}
                class={`mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading()}
              >
                <Show when={loading()} fallback="Play Full Text">
                  Loading...
                </Show>
              </button>
              <Show when={audioUrl()}>
                <audio controls src={audioUrl()} class="w-full mt-4"></audio>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default StudentDashboard;