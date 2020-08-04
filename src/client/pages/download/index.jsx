import React, { useEffect, useState } from 'react';
import { api } from '../../services';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
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
            api.get(`/api/invoice/${id}`).then((res) => {
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

        items.forEach(function (url, index) {
            const filename = `${url.song.artist} - ${url.song.album} - ${url.song.trackNo} ${url.song.title}`;
            // loading a file and add it in a zip file
            const s3 = new AWS.S3();

            const myBucket = 'pblibrary';
            const myKey = `${url.song.url.split('/')[3]}/${url.song.url.split('/')[4]}`;
            s3.getObject({ Bucket: myBucket, Key: myKey }, function (error, data) {
                if (data) {
                    zip.file(`${filename}.mp3`, data.Body);
                    if (index === items.length - 1) {
                        zip.generateAsync({ type: 'blob' }).then(function (blob) {
                            saveAs(blob, 'songs.zip');
                        });
                    }
                }
            });
        });
    };

    return <></>;
}

Download.displayName = 'Download';

export default Download;
