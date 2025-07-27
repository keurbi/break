import React from 'react';

type Activity = {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: number;
    type: string;
    subType: string;
    resource: string;
    benefits: string[];
    tags: string[];
    tips: string[];
};

const ActivityCard = ({
    activity,
}: {
    activity: Activity;
}) => (
    <div
        className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between h-[370px] md:h-[350px] lg:h-[330px]"
        style={{
            minHeight: 0,
            maxHeight: '100%',
            overflow: 'hidden',
        }}
    >
        <h3 className="text-base font-bold text-[#7346FF] mb-1 truncate">
            {activity.title}
        </h3>
        <p className="mb-1 text-gray-700 text-xs line-clamp-2">
            {activity.description}
        </p>
        <div className="mb-1 text-xs text-[#7346FF]">
            <span className="font-bold">Type :</span> {activity.type}
            {activity.subType && (
                <>
                    {' '}
                    &nbsp;|&nbsp; <span className="font-bold">Sous-type :</span>{' '}
                    {activity.subType}
                </>
            )}
        </div>
        <div className="mb-1 text-xs text-[#7346FF]">
            <span className="font-bold">Durée :</span> {activity.duration} min
            &nbsp;|&nbsp;
            <span className="font-bold">Difficulté :</span> {activity.difficulty}
        </div>
        {activity.resource && (
            <div className="mb-1 text-xs">
                <a
                    href={activity.resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7346FF] underline"
                >
                    Ressource
                </a>
            </div>
        )}
        {activity.benefits.length > 0 && (
            <div className="mb-1">
                <span className="font-bold text-[#7346FF] text-xs">
                    Bénéfices :
                </span>
                <ul className="list-disc ml-4 text-gray-700 text-xs">
                    {activity.benefits.slice(0, 1).map((b, idx) => (
                        <li key={idx} className="truncate">
                            {b}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {activity.tips.length > 0 && (
            <div className="mb-1">
                <span className="font-bold text-[#7346FF] text-xs">
                    Conseils :
                </span>
                <ul className="list-disc ml-4 text-gray-700 text-xs">
                    {activity.tips.slice(0, 1).map((t, idx) => (
                        <li key={idx} className="truncate">
                            {t}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {activity.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
                {activity.tags.slice(0, 2).map((tag, idx) => (
                    <span
                        key={idx}
                        className="bg-[#F5F2FF] text-[#7346FF] px-2 py-0.5 rounded-full text-[10px] font-bold truncate"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        )}
    </div>
);

export default ActivityCard;