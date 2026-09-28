import { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { getFlavorColor } from '../utils/flavorColors';

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;
    const { addToCart } = useCart();
    const [selectedTaste, setSelectedTaste] = useState(null);

    const handleAddToCart = () => {
        if (!selectedTaste) {
            Alert.alert('Выберите вкус плз', 'Сначала выберите вкус перед добавлением в корзину');
            return;
        }
        addToCart({ ...product, selectedTaste });
        navigation.navigate('Cart');
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#2d1147', padding: 16 }}>
            <Image
                source={{ uri: product.image }}
                style={{ width: '100%', height: 230, borderRadius: 18, backgroundColor: '#fff' }}
            />
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 18 }}>
                {product.title}
            </Text>
            <Text style={{ fontSize: 22, color: '#fff', fontWeight: '700', marginTop: 4 }}>
                {product.price} {product.currency}
            </Text>
            <Text style={{ marginTop: 12, lineHeight: 21, color: '#f0f0f0' }}>
                {product.description}
            </Text>

            <Text style={{ marginTop: 20, color: '#fff', fontWeight: '700', fontSize: 16 }}>
                Выбери вкус:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {product.taste.map((flavor, index) => {
                    const isSelected = selectedTaste === flavor;
                    const flavorColor = getFlavorColor(flavor);
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedTaste(isSelected ? null : flavor)}
                            style={{
                                backgroundColor: isSelected ? flavorColor : 'rgba(0,0,0,0.2)',
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 10,
                                marginRight: 8,
                                marginBottom: 8,
                                borderWidth: 2,
                                borderColor: flavorColor,
                            }}
                        >
                            <Text style={{ color: isSelected ? '#fff' : flavorColor, fontSize: 13, fontWeight: isSelected ? '700' : '600' }}>
                                {flavor}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {selectedTaste && (
                <Text style={{ marginTop: 10, color: '#fff', fontWeight: '600' }}>
                    Выбрано: {selectedTaste}
                </Text>
            )}

            <Text style={{ marginTop: 18, color: '#f0f0f0' }}>
                📦 В наличии: @{product.channel}
            </Text>

            <TouchableOpacity
                onPress={handleAddToCart}
                style={{
                    marginTop: 20,
                    marginBottom: 30,
                    backgroundColor: selectedTaste ? '#fff' : 'rgba(255,255,255,0.3)',
                    padding: 16,
                    borderRadius: 14,
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#2d1147' }}>
                    Добавить в корзину
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}