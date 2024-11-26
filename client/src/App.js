import './stylesheets/theme.css';
import './stylesheets/alignments.css';
import './stylesheets/textelements.css';
import './stylesheets/custom-components.css';
import './stylesheets/form-elements.css';
import './stylesheets/layout.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import ProtectedRoute from './components/ProtectedRoutes';
import Home from './pages/common/Home';
import Exams from './pages/admin/Exams';
import AddEditExam from './pages/admin/Exams/AddEditExam';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import WriteExam from './pages/user/WriteExam';
import UserReports from './pages/user/UserReports';
import AdminReports from './pages/admin/AdminReports';

function App() {
  const {loading} = useSelector(state => state.loader)
  return (
    <>
    {loading && <Loader />}
    <BrowserRouter>
      <Routes>
        {/* common routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* user routes */}
        <Route path="/" element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>}>
        </Route>

        <Route path="/user/write-exam/:id" element={<ProtectedRoute>
          <WriteExam />
        </ProtectedRoute>}>
        </Route>

        <Route path="/user/reports" element={<ProtectedRoute>
          <UserReports />
        </ProtectedRoute>}>
        </Route>

        {/* Admin routes */}
        <Route path="/admin/exams" element={<ProtectedRoute>
          <Exams />
        </ProtectedRoute>}></Route>

        <Route path="/admin/exams/add" element={<ProtectedRoute>
          <AddEditExam />
        </ProtectedRoute>}></Route>

        <Route path="/admin/exams/edit/:id" element={<ProtectedRoute>
          <AddEditExam />
        </ProtectedRoute>}></Route>

        <Route path="/admin/reports" element={<ProtectedRoute>
          <AdminReports />
        </ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
