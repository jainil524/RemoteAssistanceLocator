import PropTypes from "prop-types";

function Card(props) {
    return (<div className="card">
        <h3>{props.name}</h3>
        <span>Service Provider: {props.assignee}</span>
        <span>Fees: {props.fees ? props.fees : 0}</span>
    </div>)
}

Card.propTypes = {
    name: PropTypes.string.isRequired,
    assignee: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    fees: PropTypes.string,
}
export default Card;