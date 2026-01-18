import { useNavigate } from 'react-router-dom';
import { SeriesForm } from '../components/SeriesForm';
import { useSeriesStore } from '../store/useSeriesStore';
import { v4 as uuidv4 } from 'uuid';

export default function AddSeries() {
    const navigate = useNavigate();
    const addSeries = useSeriesStore((state) => state.addSeries);

    const handleSubmit = async (data: any) => {
        const newSeries = {
            ...data,
            id: uuidv4(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        await addSeries(newSeries);
        navigate('/');
    };

    return (
        <div className="pb-20">
            <SeriesForm onSubmit={handleSubmit} />
        </div>
    );
}
