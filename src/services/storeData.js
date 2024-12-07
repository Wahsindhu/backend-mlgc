const { Firestore } = require('@google-cloud/firestore');
const path = require('path')
const pathkey = path.resolve('C:/Submission/submissionmlgc-sindhu-a7ab7e742b31.json')

async function storeData(id, data) {
    const db = new Firestore({
        projectId: 'submissionmlgc-sindhu',
        keyFilename: pathkey
    });

    const predictCollection = db.collection('prediction');
    return predictCollection.doc(id).set(data);
}

module.exports = storeData;