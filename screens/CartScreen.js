import { View, Text, FlatList, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { getFlavorColor } from '../utils/flavorColors';


export default function CartScreen() {
    const { cart, removeFromCart } = useCart();

    const totalsByCurrency = cart.reduce((acc, item) => {
        acc[item.currency] = (acc[item.currency] || 0) + item.price;
        return acc;
    }, {});

    const openChannel = (channel) => {
        const url = `https://t.me/${channel}`;
        Linking.openURL(url).catch(() =>
            Alert.alert('Ошибка', 'Не удалось открыть Telegram')
        );
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        const uniqueChannels = [...new Set(cart.map(item => item.channel))];
        if (uniqueChannels.length === 1) {
            openChannel(uniqueChannels[0]);
        } else {
            Alert.alert(
                'Товары в разных каналах',
                'Выбери, куда перейти для заказа:',
                uniqueChannels.map(ch => ({
                    text: `@${ch}`,
                    onPress: () => openChannel(ch),
                })).concat([{ text: 'Отмена', style: 'cancel' }])
            );
        }
    };

    if (cart.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: '#2d1147', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff' }}>Корзина пуста</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#2d1147', padding: 10 }}>
            <FlatList
                data={cart}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        padding: 10,
                        borderRadius: 12,
                        marginBottom: 8,
                    }}>
                        <Image source={{ uri: item.images[0] }} style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10, backgroundColor: '#fff' }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontWeight: '600' }}>{item.title}</Text>
                            {item.selectedTaste && (
                                <Text style={{ color: getFlavorColor(item.selectedTaste), fontSize: 12, fontWeight: '600' }}>
                                    Вкус: {item.selectedTaste}
                                </Text>
                            )}
                            <Text style={{ color: '#fff' }}>{item.price} {item.currency}</Text>
                            <TouchableOpacity onPress={() => openChannel(item.channel)}>
                                <Text style={{ color: '#eee', fontSize: 12, marginTop: 2 }}>
                                    📦 @{item.channel} (открыть)
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(index)}>
                            <Text style={{ color: '#ffd1d1' }}>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {Object.entries(totalsByCurrency).map(([currency, sum]) => (
                <Text key={currency} style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 5 }}>
                    Итого ({currency}): {sum}
                </Text>
            ))}

            <TouchableOpacity
                onPress={handleCheckout}
                style={{
                    marginTop: 15,
                    backgroundColor: '#fff',
                    padding: 15,
                    borderRadius: 12,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#2d1147', fontWeight: '700', fontSize: 16 }}>
                    Оформить заказ в Telegram
                </Text>
            </TouchableOpacity>
        </View>
    );
}