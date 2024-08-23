import PopOut from './PopOut';
function DeleteConfirm({ show, currentRow, confirmYes, onClose}) {

    return (
        <PopOut show={show} onClose={onClose}>
            <h3>Are you sure you want to delete this Department?</h3>

            <div id="popout-delete-confirm-buttons">
                <button id="popout-confirm-yes" onClick={() => confirmYes(currentRow)} title="Confirm Delete">Yes</button>
                <button id="popout-confirm-no" onClick={onClose} title="Cancel Delete">No</button>
            </div>
        </PopOut>
    );
};

export default DeleteConfirm;