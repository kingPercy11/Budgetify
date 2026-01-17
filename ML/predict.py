import numpy as np
import pandas as pd
import joblib

# Load the saved model and metadata
print("Loading saved model...")
model = joblib.load('./gradient_boosting_model.pkl')
metadata = joblib.load('./model_metadata.pkl')

input_columns = metadata['input_columns']
output_columns = metadata['output_columns']

print(f"\nModel loaded successfully!")
print(f"Model Performance: R² = {metadata['model_performance']['R2_Score']:.4f}")
print(f"\nInput features required: {input_columns}")
print(f"\nOutput predictions: {output_columns}")

# ============ EXAMPLE PREDICTION ============

print("\n" + "="*70)
print("EXAMPLE PREDICTION")
print("="*70)

# Example input data - you can modify these values
example_input = {
    'Income': 50000,
    'Age': 30,
    'Dependents': 1,
    'City_Tier_Encoded': 0,  # 0=Tier_1, 1=Tier_2, 2=Tier_3
    'Occupation_Salaried': 1,  # One-hot encoded: 1=Salaried, 0=Not Salaried
    'Occupation_Self_Employed': 0,  # 1=Self_Employed, 0=Not Self_Employed
    'Occupation_Student': 0  # 1=Student, 0=Not Student
    # Add any other encoded occupation columns that were created during training
}

# Create DataFrame with the same column order as training
input_df = pd.DataFrame([example_input])

# Ensure all required columns are present
for col in input_columns:
    if col not in input_df.columns:
        input_df[col] = 0

# Reorder columns to match training data
input_df = input_df[input_columns]

print("\nInput Data:")
print(input_df.T)

# Make prediction
predictions = model.predict(input_df)

print("\n" + "="*70)
print("PREDICTED EXPENSES")
print("="*70)

# Display predictions
results = pd.DataFrame({
    'Category': output_columns,
    'Predicted Amount': predictions[0]
})

print("\n", results.to_string(index=False))

print(f"\nTotal Predicted Expenses: {predictions[0].sum():.2f}")
print(f"Income: {example_input['Income']:.2f}")
print(f"Remaining: {example_input['Income'] - predictions[0].sum():.2f}")

# ============ CUSTOM PREDICTION FUNCTION ============

def predict_expenses(income, age, dependents, city_tier, occupation):
    """
    Predict expenses for all categories
    
    Parameters:
    - income: Annual income (float)
    - age: Age (int)
    - dependents: Number of dependents (int)
    - city_tier: 'Tier_1', 'Tier_2', or 'Tier_3'
    - occupation: 'Salaried', 'Self_Employed', 'Student', or 'Retired'
    
    Returns:
    - Dictionary with predicted expenses for each category
    """
    
    # Encode city tier
    city_tier_mapping = {'Tier_1': 0, 'Tier_2': 1, 'Tier_3': 2}
    city_tier_encoded = city_tier_mapping.get(city_tier, 0)
    
    # One-hot encode occupation
    occupation_mapping = {
        'Occupation_Salaried': 1 if occupation == 'Salaried' else 0,
        'Occupation_Self_Employed': 1 if occupation == 'Self_Employed' else 0,
        'Occupation_Student': 1 if occupation == 'Student' else 0
    }
    
    # Create input dictionary
    input_data = {
        'Income': income,
        'Age': age,
        'Dependents': dependents,
        'City_Tier_Encoded': city_tier_encoded,
        **occupation_mapping
    }
    
    # Create DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Ensure all required columns are present
    for col in input_columns:
        if col not in input_df.columns:
            input_df[col] = 0
    
    # Reorder columns
    input_df = input_df[input_columns]
    
    # Make prediction
    predictions = model.predict(input_df)[0]
    
    # Return as dictionary
    return {category: amount for category, amount in zip(output_columns, predictions)}

# ============ EXAMPLE USAGE OF FUNCTION ============

print("\n" + "="*70)
print("CUSTOM PREDICTION EXAMPLE")
print("="*70)

# Example: Predict for a 35-year-old salaried person with income 60000
custom_prediction = predict_expenses(
    income=60000,
    age=35,
    dependents=2,
    city_tier='Tier_1',
    occupation='Salaried'
)

print("\nPrediction for:")
print("  Income: 60,000")
print("  Age: 35")
print("  Dependents: 2")
print("  City: Tier_1")
print("  Occupation: Salaried")
print("\nPredicted Expenses:")
for category, amount in custom_prediction.items():
    print(f"  {category}: {amount:.2f}")

total_expenses = sum(custom_prediction.values())
print(f"\nTotal Expenses: {total_expenses:.2f}")
print(f"Savings: {60000 - total_expenses:.2f}")

# ============ BATCH PREDICTIONS ============

print("\n" + "="*70)
print("BATCH PREDICTION EXAMPLE")
print("="*70)

# Multiple users
users_data = [
    {'Income': 40000, 'Age': 25, 'Dependents': 0, 'city_tier': 'Tier_2', 'occupation': 'Student'},
    {'Income': 80000, 'Age': 40, 'Dependents': 3, 'city_tier': 'Tier_1', 'occupation': 'Self_Employed'},
    {'Income': 55000, 'Age': 32, 'Dependents': 1, 'city_tier': 'Tier_3', 'occupation': 'Salaried'},
]

print("\nPredicting expenses for multiple users...\n")

for i, user in enumerate(users_data, 1):
    print(f"User {i}: Income={user['Income']}, Age={user['Age']}, Dependents={user['Dependents']}, {user['city_tier']}, {user['occupation']}")
    
    predictions = predict_expenses(
        income=user['Income'],
        age=user['Age'],
        dependents=user['Dependents'],
        city_tier=user['city_tier'],
        occupation=user['occupation']
    )
    
    total = sum(predictions.values())
    print(f"  Total Predicted Expenses: {total:.2f}")
    print(f"  Top 3 Categories:")
    sorted_predictions = sorted(predictions.items(), key=lambda x: x[1], reverse=True)
    for cat, amt in sorted_predictions[:3]:
        print(f"    - {cat}: {amt:.2f}")
    print()
