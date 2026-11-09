import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { RequireRole } from './auth/RequireRole';
import { Home } from './pages/Home';
import { Sponsors } from './pages/Sponsors';
import { SponsorDetail } from './pages/SponsorDetail';
import { Resources } from './pages/Resources';
import { Students } from './pages/Students';
import { Alumni } from './pages/Alumni';
import { Team } from './pages/Team';
import { Schedule } from './pages/Schedule';
import { Blog } from './pages/Blog';
import { BlogPostPage } from './pages/BlogPost';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ResetPassword } from './pages/ResetPassword';
import { NotFound } from './pages/NotFound';
import { PortalIndex } from './pages/portal/PortalIndex';
import { StudentProfile } from './pages/portal/StudentProfile';
import { Messages } from './pages/portal/Messages';
import { SponsorPortal } from './pages/portal/SponsorPortal';
import { AdminHome } from './pages/portal/AdminHome';
import { AdminThread } from './pages/portal/AdminThread';
import { AnnouncementForm } from './pages/portal/AnnouncementForm';

// A route guard controls the reader experience only. Row Level Security is the
// real boundary. Refer to BUILD_SPEC.md, section 4.2.
export function App() {
  // basename carries the GitHub Pages path prefix.
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/sponsors/:sponsorId" element={<SponsorDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/students" element={<Students />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/team" element={<Team />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<RequireAuth />}>
            <Route path="/portal" element={<PortalIndex />} />

            <Route element={<RequireRole roles={['student']} />}>
              <Route path="/portal/profile" element={<StudentProfile />} />
            </Route>

            <Route element={<RequireRole roles={['student', 'sponsor']} />}>
              <Route path="/portal/messages" element={<Messages />} />
            </Route>

            <Route element={<RequireRole roles={['sponsor']} />}>
              <Route path="/portal/sponsor" element={<SponsorPortal />} />
            </Route>

            <Route element={<RequireRole roles={['admin']} />}>
              <Route path="/portal/admin" element={<AdminHome />} />
              <Route path="/portal/admin/messages" element={<AdminThread />} />
              <Route path="/portal/admin/messages/:conversationId" element={<AdminThread />} />
            </Route>

            <Route element={<RequireRole roles={['admin', 'announcements']} />}>
              <Route path="/portal/admin/announcements" element={<AnnouncementForm />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
