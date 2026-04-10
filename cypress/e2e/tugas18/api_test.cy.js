describe('Platzi Fake Store API Automation (Categories) - tugas18', () => {
    const baseUrl = 'https://api.escuelajs.co/api/v1/categories';
    let categoryId;

    it('TC01 - GET All Categories', () => {
        cy.request('GET', baseUrl).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            
            // Simpan ID kategori pertama untuk test case berikutnya
            categoryId = response.body[0].id;
        });
    });

    it('TC02 - GET Single Category', () => {
        cy.request('GET', `${baseUrl}/${categoryId}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', categoryId);
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('image');
        });
    });

    it('TC03 - GET Category (Not Found)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/999999`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400); // Platzi API returns 400 for non-existent category ID format or 404
        });
    });

    it('TC04 - POST Create Category', () => {
        const newCategory = {
            name: 'Gadget Baru ' + Math.random(),
            image: 'https://placeimg.com/640/480/any'
        };

        cy.request('POST', baseUrl, newCategory).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', newCategory.name);
            expect(response.body).to.have.property('image', newCategory.image);
            
            // Simpan ID untuk didelete nanti
            categoryId = response.body.id;
        });
    });

    it('TC05 - PUT Update Category', () => {
        const updatedCategory = {
            name: 'Kategori Terupdate'
        };

        cy.request('PUT', `${baseUrl}/${categoryId}`, updatedCategory).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('name', updatedCategory.name);
        });
    });

    it('TC06 - GET Products by Category', () => {
        cy.request('GET', `${baseUrl}/${categoryId}/products`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('TC07 - DELETE Category', () => {
        cy.request('DELETE', `${baseUrl}/${categoryId}`).then((response) => {
            expect(response.status).to.eq(200);
            // API mengembalikan string 'true' atau boolean true?
            // Dari log error: expected 'true' to be true (actual 'true', expected true)
            expect(response.body.toString()).to.eq('true');
        });
    });

    it('TC08 - Validation: Schema Categories', () => {
        cy.request('GET', baseUrl).then((response) => {
            const firstCategory = response.body[0];
            // Tambahkan 'slug' ke dalam keys
            expect(firstCategory).to.have.all.keys('id', 'name', 'image', 'creationAt', 'updatedAt', 'slug');
        });
    });

    it('TC09 - POST Create Category (Negative - Invalid Body)', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                name: '' // Invalid empty name
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.be.oneOf([400, 500]);
        });
    });

    it('TC10 - GET All Categories (Validate Content-Type)', () => {
        cy.request('GET', baseUrl).then((response) => {
            expect(response.headers['content-type']).to.include('application/json');
        });
    });

    it('TC11 - GET All Products', () => {
        cy.request('GET', 'https://api.escuelajs.co/api/v1/products').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
        });
    });

    it('TC12 - GET Products with Pagination (offset & limit)', () => {
        cy.request('GET', 'https://api.escuelajs.co/api/v1/products?offset=0&limit=10').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.at.most(10);
        });
    });

    it('TC13 - GET All Users', () => {
        cy.request('GET', 'https://api.escuelajs.co/api/v1/users').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
        });
    });

    it('TC14 - POST Create User', () => {
        const newUser = {
            name: 'Junie Test',
            email: 'junie' + Math.random() + '@example.com',
            password: 'password123',
            avatar: 'https://api.lorem.space/image/face?w=150&h=150'
        };

        cy.request('POST', 'https://api.escuelajs.co/api/v1/users', newUser).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', newUser.name);
            expect(response.body).to.have.property('email', newUser.email);
        });
    });

    it('TC15 - GET Single User (Not Found)', () => {
        cy.request({
            method: 'GET',
            url: 'https://api.escuelajs.co/api/v1/users/999999',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.be.oneOf([400, 404]);
        });
    });
});
