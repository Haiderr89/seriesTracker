import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SeriesForm } from '../components/SeriesForm';
import { useSeriesStore } from '../store/useSeriesStore';

export default function EditSeries() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { series, updateSeries, loadSeries } = useSeriesStore();

    const seriesToEdit = series.find((s) => s.id === id);

    useEffect(() => {
        if (!seriesToEdit) {
            loadSeries();
        }
    }, [seriesToEdit, loadSeries]);

    if (!seriesToEdit) {
        return <div>Loading...</div>;
    }

    const handleSubmit = async (data: any) => {
        const updatedSeries = {
            ...seriesToEdit,
            ...data,
            updatedAt: Date.now(),
        };
        await updateSeries(updatedSeries);
        navigate(`/series/${id}`);
    };

    return (
        <div className="pb-20">
            <SeriesForm initialData={seriesToEdit} onSubmit={handleSubmit} />
        </div>
    );
}
