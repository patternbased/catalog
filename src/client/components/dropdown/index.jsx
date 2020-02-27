import React, { useState } from 'react';
import PropTypes from 'prop-types';

import IconArrow from 'assets/images/dropdown-arrow.svg';

import './style.scss';

/**
 * Dropdown component
 * @returns {React.Component}
 */
function Dropdown({ placeholder, selectedLabel, opened, onClick, children }) {
    return (
        <div className="dropdown">
            <div className="dropdown__container" onMouseDown={onClick}>
                {selectedLabel.length > 0 && <div className="dropdown__container__selected">{selectedLabel}</div>}
                {selectedLabel.length === 0 && (
                    <div className="dropdown__container__selected dropdown__container__selected--default">
                        {placeholder}
                    </div>
                )}
                <IconArrow className="dropdown__arrow" />
            </div>

            {opened && <div className="dropdown__options">{children}</div>}
        </div>
    );
}

Dropdown.propTypes = {
    placeholder: PropTypes.string,
    selectedLabel: PropTypes.string,
    children: PropTypes.element.isRequired,
    opened: PropTypes.bool,
    onClick: PropTypes.func,
};

Dropdown.defaultProps = {
    placeholder: 'Select option',
    selectedLabel: '',
    opened: false,
    onClick: () => {},
};

export default Dropdown;
