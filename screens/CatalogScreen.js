import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { vapeData } from '../data/vapeData';
import { useCart } from '../context/CartContext';

export default function CatalogScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const { cart, addToCart } = useCart();

    useEffect(() => {
        fetch(`https://dummyjson.com/products?limit=${vapeData.length}`)
            .then(res => {
                if (!res.ok) throw new Error('Ошибка сети');
                return res.json();
            })
            .then(data => {
                const merged = data.products.map((item, index) => {
                    const vape = vapeData[index];
                    return {
                        id: item.id,
                        title: vape.title,
                        price: vape.price,
                        currency: vape.currency,
                        description: vape.description,
                        images: vape.images, // ← было "image", стало "images"
                        channel: vape.channel,
                        taste: vape.taste,
                        rating: item.rating,
                    };
                });
                setProducts(merged);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    // быстрое добавление — берём первый вкус по умолчанию
    const handleQuickAdd = (item) => {
        addToCart({ ...item, selectedTaste: item.taste[0] });
    };

    // считаем итог по валютам для плавающей кнопки
    const totalsByCurrency = cart.reduce((acc, item) => {
        acc[item.currency] = (acc[item.currency] || 0) + item.price;
        return acc;
    }, {});

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(45 17 71)' }}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: '#fff', marginTop: 15, fontSize: 16, fontWeight: '700' }}>
                    Загружаем каталог...
                </Text>
                <Text style={{ color: '#eee', marginTop: 5, fontSize: 12 }}>
                    Подбираем лучшие вкусы 💨
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6a577f' }}>
                <Text style={{ color: '#fff' }}>Ошибка: {error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#2e2e2e' }}>
            <View style={{ paddingHorizontal: 14, paddingTop: 14, paddingBottom: 8 }}>
                <TextInput
                    placeholder="Поиск товара..."
                    placeholderTextColor="#eee"
                    value={search}
                    onChangeText={setSearch}
                    style={{
                        padding: 13,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 14,
                        color: '#fff',
                        fontSize: 14,
                    }}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: 14,
                            marginBottom: 10,
                            backgroundColor: 'rgba(0,0,0,0.15)',
                            borderRadius: 16,
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                            onPress={() => navigation.navigate('ProductDetail', { product: item })}
                        >
                            <Image source={{ uri: item.images[0] }}
                                style={{ width: 64, height: 64, marginRight: 14, borderRadius: 12, backgroundColor: '#fff' }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{item.title}</Text>
                                <Text style={{ color: '#fff', marginTop: 4, fontWeight: '600' }}>
                                    {item.price} {item.currency}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleQuickAdd(item)}
                            style={{
                                backgroundColor: '#fff',
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 8,
                            }}
                        >
                            <Text style={{ color: '#000000', fontWeight: '900', fontSize: 18 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Плавающая кнопка корзины */}
            {cart.length > 0 && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Cart')}
                    style={{
                        position: 'absolute',
                        bottom: 24,
                        alignSelf: 'center',
                        backgroundColor: '#2d1147',
                        paddingVertical: 12,
                        paddingHorizontal: 22,
                        borderRadius: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, marginRight: 8 }}></Text>
                    <Text style={{ color: '#6a577f', fontWeight: '800', fontSize: 15 }}>
                        {Object.entries(totalsByCurrency).map(([currency, sum], i) => (
                            <Text key={currency}>
                                {sum} {currency}{i < Object.entries(totalsByCurrency).length - 1 ? ' + ' : ''}
                            </Text>
                        ))}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}