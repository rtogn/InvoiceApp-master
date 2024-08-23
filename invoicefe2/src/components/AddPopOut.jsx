import PopOut from './PopOut';
function AddPopOut({ show, save, onChange, onClose }) {

    return (
        <PopOut show={show} onClose={onClose}>
            <div>
                <h3>Add a Department</h3>
                <div key="name">
                    <label>Name: </label>
                    <input type="text" name="name" placeholder="Name" onChange={onChange} />
                </div>
                <div key="shortCode">
                    <label>Short Code: </label>
                    <input type="text" name="shortCode" placeholder="ShortCode" onChange={onChange} />
                </div>
                <button onClick={save} title="Save Changes">Save</button>
            </div>
        </PopOut>
    );
};

export default AddPopOut;