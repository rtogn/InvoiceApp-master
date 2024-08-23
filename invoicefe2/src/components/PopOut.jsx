import '../css/PopOut.css'

function PopOut({show, onClose, children}) {
    if (!show) { return <></>; }

    return (
        <div className="popout-background">
            <div className="popout-body">
                <button onClick={onClose} id="add-button" className="popout-close" title="Cancel">X</button>
                {children}
            </div>
        </div>
    );
};

export default PopOut;