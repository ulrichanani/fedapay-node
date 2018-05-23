import { expect } from 'chai';
import * as nock from 'nock';
import * as faker from 'faker';
import { ApiConnectionError, Transaction, FedaPayObject } from '../src';
import { exceptRequest, setUp, tearDown } from './utils';

describe('TransactionTests', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should return transactions', async () => {
        let body = {
            'v1/transactions': [{
                'id': 1,
                'klass': 'v1/transaction',
                'transaction_key': '0KJAU01',
                'reference': '109329828',
                'amount': 100,
                'description': 'Description',
                'callback_url': 'http://e-shop.com',
                'status': 'pending',
                'customer_id': 1,
                'currency_id': 1,
                'mode': 'mtn',
                'created_at': '2018-03-12T09:09:03.969Z',
                'updated_at': '2018-03-12T09:09:03.969Z',
                'paid_at': '2018-03-12T09:09:03.969Z'
            }],
            'meta': { 'page': 1 }
        };

        nock(/fedapay\.com/)
            .get('/v1/transactions')
            .reply(200, body);

        let object = await Transaction.all();

        console.log(object);

        exceptRequest({
            url: 'https://sdx-api.fedapay.com/v1/transactions',
            method: 'get'
        });

/* 
        expect(object).to.be.instanceof(FedaPayObject);
        expect(object.meta).to.be.instanceof(FedaPayObject);
        expect(object.transactions[0]).to.be.instanceof(Transaction);
        expect(object.transactions[0].id).to.equal(1);
        expect(object.transactions[0].klass).to.equal('v1/transaction');
        expect(object.transactions[0].transaction_key).to.equal('0KJAU01');
        expect(object.transactions[0].reference).to.equal('109329828');
        expect(object.transactions[0].amount).to.equal(100);
        expect(object.transactions[0].description).to.equal('Description');
        expect(object.transactions[0].callback_url).to.equal('http://e-shop.com');
        expect(object.transactions[0].status).to.equal('pending');
        expect(object.transactions[0].customer_id).to.equal(1);
        expect(object.transactions[0].currency_id).to.equal(1);
        expect(object.transactions[0].mode).to.equal('mtn');
        expect(object.transactions[0].created_at).to.equal('2018-03-12T09:09:03.969Z');
        expect(object.transactions[0].updated_at).to.equal('2018-03-12T09:09:03.969Z');
        expect(object.transactions[0].paid_at).to.equal('2018-03-12T09:09:03.969Z'); */
    });

    it('should retrieve a transaction', async () => {
        let body = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'transaction_key': '0KJAU01',
                'reference': '109329828',
                'amount': 100,
                'description': 'Description',
                'callback_url': 'http://e-shop.com',
                'status': 'pending',
                'customer_id': 1,
                'currency_id': 1,
                'mode': 'mtn',
                'created_at': '2018-03-12T09:09:03.969Z',
                'updated_at': '2018-03-12T09:09:03.969Z',
                'paid_at': '2018-03-12T09:09:03.969Z'
            }
        };

        nock(/fedapay\.com/)
            .get('/v1/transactions/1')
            .reply(200, body);

        let transaction = await Transaction.retrieve(1);
        console.log(transaction.id);
        exceptRequest({
            url: 'https://sdx-api.fedapay.com/v1/transactions/1',
            method: 'get'
        });


        expect(transaction).to.be.instanceof(FedaPayObject);
        expect(transaction).to.be.instanceof(Transaction);
        expect(transaction.id).to.equal(1);
        expect(transaction.klass).to.equal('v1/transaction');
        expect(transaction.transaction_key).to.equal('0KJAU01');
        expect(transaction.reference).to.equal('109329828');
        expect(transaction.amount).to.equal(100);
        expect(transaction.description).to.equal('Description');
        expect(transaction.callback_url).to.equal('http://e-shop.com');
        expect(transaction.status).to.equal('pending');
        expect(transaction.customer_id).to.equal(1);
        expect(transaction.currency_id).to.equal(1);
        expect(transaction.mode).to.equal('mtn');
        expect(transaction.created_at).to.equal('2018-03-12T09:09:03.969Z');
        expect(transaction.updated_at).to.equal('2018-03-12T09:09:03.969Z');
        expect(transaction.paid_at).to.equal('2018-03-12T09:09:03.969Z');
    });
});