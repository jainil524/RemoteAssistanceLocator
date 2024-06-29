import "../CSS/PopUp.css";
import PropTypes from "prop-types";

function PopUp(props) {
    function hide(event) {
        if (event.target.id == "popUpContainer") {
            props.hidefunction();
            console.log("hello")
        }
    }

    return (
        <div id="popUpContainer" className="popUp-container" onClick={hide}>
            <div className="pop-up">
                {props.children}
            </div>
        </div>
    );
}

PopUp.propTypes = {
    children: PropTypes.element.isRequired,
    hidefunction: PropTypes.func
}

export default PopUp;