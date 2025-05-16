interface BackgroundSvgProps {
    src: string;
}

export default function BackgroundSvg({ src }: BackgroundSvgProps) {
    return (
        <div className="absolute inset-0 z-[-1] w-full h-full">
            <img
                src={src}
                alt="Background"
                className="w-full h-full object-cover"
            />
        </div>
    );
}
