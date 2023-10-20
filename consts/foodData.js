
import { useEffect, useState } from 'react';

import {collection, addDoc, getFirestore, doc, setDoc, getDocs, where, query} from 'firebase/firestore';

const db = getFirestore();
const restaurantsRef = collection(db, 'restaurants');
const foodsRef = collection(db, 'Foods');
const useRef = collection(db,'users');

export function usersList() {
    const [users, setusers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Replace this with the actual query to fetch user data
                const q = query(useRef);
                const querySnapshot = await getDocs(q);

                const fetchedUsers = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const credits = doc.credits;
                    const email = data.email;
                    const rating = data.rating;
                    let profile = data.profileImageUrl || '../assets/jimmys.jpg';
                    const status = data.deliveryStatus;
                    const name = data.username;
                    const number = data.studentNum;

                    fetchedUsers.push({ credits, name, profile, email, rating, number, status });
                    console.log(`Document ID: ${number}, Name: ${name}, Credits: ${credits}`);
                });

                setusers(fetchedUsers);
                setIsLoading(false); // Set isLoading to false when data fetching is complete
            } catch (error) {
                console.log('Error getting documents', error);
                setIsLoading(false); // Handle errors by setting isLoading to false
            }
        }
        fetchData();
    }, []);

    return { users, isLoading };
}

export function useFetchRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const q = query(restaurantsRef);
                const querySnapshot = await getDocs(q);

                const fetchedRestaurants = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    const name = data.Name;
                    const location = data.Location;
                    let imageURL = data.imgurl || '../assets/jimmys.jpg';

                    fetchedRestaurants.push({ id, name, imageURL, location });
                    console.log(`Document ID: ${id}, Name: ${name}, Location: ${location}`);
                });

                setRestaurants(fetchedRestaurants);
                setIsLoading(false); // Set isLoading to false when data fetching is complete
            } catch (error) {
                console.log('Error getting documents', error);
                setIsLoading(false); // Handle errors by setting isLoading to false
            }
        }
        fetchData();
    }, []);

    return { restaurants, isLoading };
}

 export function foodList(){
    const [allFoods, setFoods] = useState([]);
     const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function fetchData() {
            try {
                const q = query(foodsRef);
                const querySnapshot = await getDocs(q);

                const fetchedFoods = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    const name = data.Name;
                    const restaurantName = data.Restaurant;
                    const foodCategory = data.Type;
                    const numberSubtype = data.NumberSubtype;
                    const description = data.Description;
                    const price = data.Price;
                    const favourited = data.Favourited;
                    let imageURL = data.imgurl || '../assets/jimmys.jpg';

                    fetchedFoods.push({ id, name, imageURL, restaurantName, foodCategory, numberSubtype, description, price, favourited });
                    console.log(`Document ID: ${id}, Name: ${name}`);
                });

                setFoods(fetchedFoods);
                setIsLoading(false); // Set isLoading to false when data fetching is complete
            } catch (error) {
                console.log('Error getting documents', error);
                setIsLoading(false); // Handle errors by setting isLoading to false
            }
        }
        fetchData();
    }, []);

    return [allFoods , isLoading];

}


// export function  restaurantFoodList(restaurantName){
//     const [isLoading, setIsLoading] = useState(true);
//     const [filteredFoods, setFilteredFoods] = useState([])
//
//     useEffect(() => {
//         const {allFoods} = FoodList();
//         if (allFoods.length > 0) {
//             const filtered = allFoods.filter(item => item.restaurantName === restaurantName);
//             setFilteredFoods(filtered);
//
//         }
//     }, [restaurantName]);
//     setIsLoading(false);
//
//     return { isLoading, filteredFoods };
// }
