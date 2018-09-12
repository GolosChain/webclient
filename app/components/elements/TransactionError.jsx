import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import transaction from 'app/redux/Transaction'
import {Map} from 'immutable'

const {func, string} = PropTypes

/** Sole consumer for a transaction error of a given type. */
class TransactionError extends React.Component {
    static propTypes = {
        // HTML properties
        opType: string.isRequired,
        error: string, // additional error (optional)

        // Redux connect properties
        addListener: func.isRequired,
        removeListener: func.isRequired,
        errorKey: string,
        exception: string,
    }
    componentWillMount() {
        const {opType, addListener} = this.props
        addListener(opType)
    }
    componentWillUnmount() {
        const {opType, removeListener} = this.props
        removeListener(opType)
    }
    render() {
        const{errorKey, exception, error} = this.props
        const cn = "error callout alert"
        if(!errorKey && !exception) {
            if(!error) return <span></span>
                return (
                    <span className="TransactionError">
                        <div className={cn}>{error}</div>
                    </span>
                )
        }
        const text = (errorKey ? errorKey : exception)
        return (
            <span className="TransactionError">
                <div className={cn}>{text}</div>
            </span>
        )
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const {opType} = ownProps
        const error = state.transaction.getIn(['TransactionError', opType]) || Map()
        const {key, exception} = error.toJS()
        return {
            ...ownProps,
            errorKey: key, exception,
        }
    },
    // mapDispatchToProps
    dispatch => ({
        addListener: (opType) => {
            dispatch(transaction.actions.set({key: ['TransactionError', opType + '_listener'], value: true}))
        },
        removeListener: (opType) => {
            dispatch(transaction.actions.remove({key: ['TransactionError', opType]}))
            dispatch(transaction.actions.remove({key: ['TransactionError', opType + '_listener']}))
        },
    })
)(TransactionError)
