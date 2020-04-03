import React, { useEffect, useState } from 'react';
import { api } from '../../services';

import './style.scss';

/**
 * Component to handle Invoice page
 * @param {Object} props router props
 * @returns {React.Component}
 */
function Invoice(props) {
    const id = props.match.params.id;
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        if (id) {
            api.get(`/api/invoice/${id}`).then(res => {
                setInvoice(res.invoice);
            });
        }
    }, [id]);

    // fields, subtotal, total, pItems, orderNo, licenseId, dateAdded

    return (
        <>
            {invoice && (
                <div className="invoice">
                    
                </div>
            )}
        </>
    );
}

Invoice.displayName = 'Invoice';

export default Invoice;
