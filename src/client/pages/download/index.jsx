import React, { useEffect, useState } from 'react';
import { api } from '../../services';
import JSZip from 'jszip';
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

/**
 * Component to handle Download page
 * @param {Object} props router props
 * @returns {React.Component}
 */
function Download(props) {
    const id = props.match.params.id;
    const [items, setItems] = useState(null);

    useEffect(() => {
        if (id) {
            api.get(`/api/invoice/${id}`).then(res => {
                setItems(res.invoice.purchasedItems);
            });
        }
    }, [id]);

    useEffect(() => {
        if (items) {
            zipFiles();
        }
    }, [items]);

    const zipFiles = () => {
        const zip = new JSZip();
        let count = 0;

        items.forEach(function(url) {
            const filename = `${url.song.title} - ${url.song.artist}`;
            // loading a file and add it in a zip file
            const s3 = new AWS.S3();

            const myBucket = 'pblibrary';
            const myKey = `${url.song.url.split('/')[3]}/${url.song.url.split('/')[4]}`;
            const signedUrlExpireSeconds = 60 * 60 * 24 * 7; // 7 days

            const link = s3.getSignedUrl('getObject', {
                Bucket: myBucket,
                Key: myKey,
                Expires: signedUrlExpireSeconds,
            });
            zip.file(`${filename}.txt`, link);
            count++;
            if (count === items.length) {
                zip.generateAsync({ type: 'base64' }).then(function(base64) {
                    window.location = 'data:application/zip;base64,' + base64;
                });
            }
        });
    };

    return <></>;
}

Download.displayName = 'Download';

export default Download;
