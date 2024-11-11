import { createSignal, onMount, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate, Route, Routes } from '@solidjs/router';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = createSignal(null);
  const [role, setRole] = createSignal('');
  const navigate = useNavigate();

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      determineUserRole(user);
    }
  };

  onMount(() => {
    checkUserSignedIn();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        setUser(session.user);
        determineUserRole(session.user);
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const determineUserRole = async (user) => {
    // Fetch user profile to get role
    const { data, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (data) {
      setRole(data.role);
      if (data.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } else {
      console.error(error);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/login" element={
          <div class="flex items-center justify-center h-full">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
              />
            </div>
          </div>
        } />
        <Show when={user() && role()}>
          <Route path="/teacher" component={TeacherDashboard} />
          <Route path="/student" component={StudentDashboard} />
        </Show>
      </Routes>
    </div>
  );
}

export default App;