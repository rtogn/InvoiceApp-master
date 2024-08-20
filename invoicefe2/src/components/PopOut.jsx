import '../css/PopOut.css'

function PopOut({show, onClose, children}) {
    if (!show) { return null; }

    return (
        <div className="popout-background">
            <div className="popout-body">
                <button onClick={onClose} className="popout-close" title="Cancel">X</button>
                {children}
            </div>
        </div>
    );
};

export default PopOut;