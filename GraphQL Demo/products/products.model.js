const products = [
    {
        id: 'redshoe',
        description: 'Red Shoe',
        price: 42.12
    },
    {
        id: 'bluejean',
        description: 'Blue Jeans',
        price: 55.55,
    }
]

const getAllProducts = () => {
    return products
}

module.exports = {
    getAllProducts
};
