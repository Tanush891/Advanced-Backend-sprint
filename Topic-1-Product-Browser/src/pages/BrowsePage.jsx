import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";



function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        async function loadProduct() {
            const response = await fetch(`https://dummyjson.com/products/${id}`);
            const data = await response.json();
            setProduct(data);
        }
        loadProduct();
    }, [id]);

    if (!product) {
        return <p>Loading product details...</p>;

    }

    return (
        <div>
            <Link to="/">Back to Products</Link>
            <h2>{product.title}</h2>
            <img src={product.thumbnail} />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Category: {product.category}</p>
            <p>Stock: {product.stock}</p>
            <p>{product.reviews.length} reviews</p>
        </div>
    );
}

export default ProductDetailPage;