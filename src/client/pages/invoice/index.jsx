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

    return (
        <>
            {invoice && (
                <div className="invoice">
                    <div className="invoice__header">INVOICE</div>
                    <div className="invoice__body">
                        <div className="invoice__body__header">
                            <div className="invoice__body__header__main">
                                <span>
                                    Order# ${invoice.orderNo}
                                    <br /> Paid in Full : ${invoice.dateAdded}
                                </span>
                            </div>
                            <div className="invoice__body__header__main">
                                <img src="/assets/images/PatternBased_Logo_CL.png" />
                            </div>
                        </div>
                        <div className="invoice__body__header">
                            <div className="invoice__body__header__main">
                                <span>TO:</span>
                                <br />
                                {`${invoice.customer.firstName} ${invoice.customer.lastName}`}
                                {invoice.customer.company && (
                                    <>
                                        <br />
                                        {invoice.customer.company}
                                    </>
                                )}
                                <br />
                                {invoice.customer.email}
                                <br />
                                {invoice.customer.address1}
                                <br />
                                {`${invoice.customer.city}, ${invoice.customer.country}`}
                            </div>
                            <div className="invoice__body__header__main">
                                PatternBased Corp
                                <br />
                                www.patternbased.com
                                <br />
                                48999 Paradise Ave. <br />
                                Morongo Valley, CA, 92256, USA
                                <br />
                                info@patternbased.com
                                <br />
                                EIN: 82-2751106
                            </div>
                        </div>
                        <div className="invoice__body__table">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="invoice__body__table__long">
                                            Description (Thack title / Artist)
                                        </th>
                                        <th>Amount</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.purchasedItems.map((item, index) => (
                                        <tr key={index}>
                                            <td className="invoice__body__table__long">
                                                {`${item.type} (${item.song.title} / ${item.song.artist})`}
                                            </td>
                                            <td>1</td>
                                            <td>${item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tbody>
                                    <tr className="border">
                                        <td className="invoice__body__table__long">Subtotal</td>
                                        <td></td>
                                        <td>${invoice.amount}</td>
                                    </tr>
                                </tbody>
                                <thead className="footer">
                                    <tr>
                                        <th className="invoice__body__table__long">Total</th>
                                        <th></th>
                                        <th>${invoice.amount}</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="invoice__body__footer">
                            <div className="invoice__body__footer__content">
                                All amounts shown are in USD.
                                <br /> This is a computer generated invoice. No signature is required.
                            </div>
                            <div className="invoice__body__footer__content">
                                <a
                                    href="https://legal.patternbased.com/privacy-policy/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="https://legal.patternbased.com/license-agreement/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    License Agreement
                                </a>
                            </div>
                            <div className="invoice__body__footer__content">
                                © Copyright 2018-2020 PatternBased Corp
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Invoice.displayName = 'Invoice';

export default Invoice;
