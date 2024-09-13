import { useState } from 'react';
import PopOut from './PopOut';
import DeleteConfirmPopOut from './DeleteConfirmPopOut';

function EditPopOut({ show, currentRow, setCurrentRow, onSave, onClose, deleteMethod }) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    function handleEditFormChange(e) {
        const { name, value } = e.target;
        setCurrentRow((currentRow) => ({
            ...currentRow,
            [name]: value,
        }));
    }

    const handleDeleteConfirmYes = (row) => {     
        deleteMethod(row);
        handleCloseDeleteConfirmPopOuts();
        onClose();
    }

    function handleShowDeleteConfirm() {
        setShowConfirmation(true);
    }

    function handleCloseDeleteConfirmPopOuts() {
        // Delete confirm box goes back to edit screen, not to main level
        setShowConfirmation(false);
    }

    function disableIDinput(key, value) {
        let disabled = ""
        return (key === "id" ? <input type="text" name={key} defaultValue={value} onChange={handleEditFormChange} disabled />
            : <input type="text" name={key} defaultValue={value} onChange={handleEditFormChange} />);
    }

    return (
        <PopOut show={show} onClose={onClose}>
            {currentRow && (
                <div>
                    <h3>Edit Values</h3>
                    {Object.entries(currentRow).map(([key, value], index) => (
                        <div key={index}>
                            <label>{key}: </label>
                            {disableIDinput(key, value)}
                            {/*<input type="text" name={key} defaultValue={value} onChange={handleEditFormChange} />*/}
                        </div>
                    ))}
                    <button onClick={onSave} id="popout-confirm-yes" title="Save Changes">Save</button>
                    <button id="popout-delete" onClick={handleShowDeleteConfirm} title="Delete">Delete</button>

                    <DeleteConfirmPopOut
                        show={showConfirmation}
                        currentRow={currentRow}
                        confirmYes={handleDeleteConfirmYes}
                        onClose={handleCloseDeleteConfirmPopOuts} />
                </div>
            )}
        </PopOut>
    );
};

export default EditPopOut;