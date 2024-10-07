// frontend/src/components/Symbol.js

import React from 'react';
import './Symbol.css';

const Symbol = ({ type }) => {
    const symbols = {
        Friends: '🤝',
        Lovers: '❤️',
        Affection: '😍',
        Marriage: '💍',
        Enemies: '👿',
        Siblings: '👫',
    };

    return (
        <div className="symbol">
            <span role="img" aria-label={type}>
                {symbols[type] || '❓'}
            </span>
        </div>
    );
};

export default Symbol;
