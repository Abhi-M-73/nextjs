
const BackgroundEffects = () => {
    return (
        <>
            <div className="fixed inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[150px]" />
            </div>

            <div className="fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />
        </>
    );
};

export default BackgroundEffects;
