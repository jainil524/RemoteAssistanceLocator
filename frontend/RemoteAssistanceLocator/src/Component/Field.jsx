import PropTypes from "prop-types";
import '../CSS/SignUp.css';

export default function Field(props) {
    return (
        <div className="Field">
            <label>
                {props.label} <sup>*</sup>
            </label>
            <input
                name={props.name}
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
            />
            <span className="error"> {props.error && <p className="error">{props.error}</p>}</span>
        </div>
    )
}

Field.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};
