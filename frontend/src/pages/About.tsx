import { useTranslation } from 'react-i18next';

export const About = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-12">{t('about.title')}</h1>

            <div className="max-w-4xl mx-auto space-y-12">
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">{t('about.story')}</h2>
                    <p className="text-gray-700 leading-relaxed">{t('about.storyText')}</p>
                </div>

                <div className="bg-gray-100 p-8 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">{t('about.mission')}</h2>
                    <p className="text-gray-700 leading-relaxed">{t('about.missionText')}</p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">{t('about.values')}</h2>
                    <p className="text-gray-700 leading-relaxed">{t('about.valuesText')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <img
                        src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600"
                        alt="Ceramic Workshop"
                        className="rounded-lg shadow-lg w-full h-64 object-cover"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600"
                        alt="Ceramic Products"
                        className="rounded-lg shadow-lg w-full h-64 object-cover"
                    />
                </div>
            </div>
        </div>
    );
};
