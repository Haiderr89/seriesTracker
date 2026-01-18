import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import AddSeries from './pages/AddSeries';
import Recommendations from './pages/Recommendations';
import Settings from './pages/Settings';

import SeriesDetails from './pages/SeriesDetails';
import EditSeries from './pages/EditSeries';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="add" element={<AddSeries />} />
                <Route path="series/:id" element={<SeriesDetails />} />
                <Route path="series/:id/edit" element={<EditSeries />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;
