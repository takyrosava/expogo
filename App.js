import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './context/CartContext';
import CatalogScreen from './screens/CatalogScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <CartProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2d1147' }, headerTintColor: '#fff' }}>
                    <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Каталог вейпов' }} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Товар' }} />
                    <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Корзина' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </CartProvider>
    );
}