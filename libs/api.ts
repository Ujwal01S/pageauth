export const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getAllFood = async () => {
    try {
        const response = await fetch(`${baseUrl}/api/sharefood`);
        if (!response.ok) {
            throw new Error(`Failed to fetch all food: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const getSingleFood = async (id: string) => {
    try {
        const response = await fetch(`${baseUrl}/api/sharefood/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch food with id ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateFood = async (id: string, foodData: FormData) => {
    try {
        const response = await fetch(`${baseUrl}/api/sharefood/${id}`, {
            method: "PUT",
            body: foodData,
        });
        if (!response.ok) {
            throw new Error(`Failed to update food with id ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteFood = async (id: string) => {
    try {
        const response = await fetch(`${baseUrl}/api/sharefood/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete food with id ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const postFood = async (formData: FormData) => {
    try {
        const response = await fetch(`${baseUrl}/api/sharefood`, {
            method: "POST",
            body: formData, // Send as FormData
        })
        if (!response.ok) {
            throw new Error(`Fail to post food`)
        }
        const data = await response.json();
        return data
    } catch (error) {
        throw error
    }
}