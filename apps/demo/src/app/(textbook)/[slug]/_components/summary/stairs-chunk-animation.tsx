"use client";
import React from "react";

interface AnimatedTextProps {
    children: React.ReactNode;
    wpm: number;
    start_delay: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ children, wpm, start_delay }) => {

    const interval = 60 / wpm;

    let globalLetterIndex = 0;


    const animateNode = (node: React.ReactNode): React.ReactNode => {
        if (typeof node === "string") {
            return node.split("").map((letter, index) => {
                const delay = start_delay + (globalLetterIndex) * (interval / 10);
                globalLetterIndex++;
                return (
                    <span
                        key={globalLetterIndex + index}
                        style={{
                            opacity: 0,
                            animation: `fadeIn 0.01s forwards`,
                            animationDelay: `${delay}s`,
                        }}
                    >
                        {letter}
                    </span>
                );
            });
        } else if (React.isValidElement(node)) {

            const element = node as React.ReactElement<{ children?: React.ReactNode }>;
            return React.cloneElement(element, {
                children: React.Children.map(element.props.children, animateNode),
            });

        }
        return node;
    };


    return <>{React.Children.map(children, animateNode)}</>;
};