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

const getProductsByPrice = (min, max) => {
    return products.filter((product) => {
        return product.price >= min && product.price <= max
    })
}

const getProductById = (id) => {
    return products.find ((product)=>{
        return product.id === id;
    })
}

module.exports = {
    getAllProducts,
    getProductsByPrice,
    getProductById,
};
