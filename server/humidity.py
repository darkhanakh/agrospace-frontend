import json
import numpy as np
from PIL import Image
from datetime import datetime
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from skimage import color

def load_config():
    with open('humidity_config.json', 'r') as file:
        return json.load(file)

def capture_map_screenshot(config):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    screenshot_file = f'map_screenshot_{timestamp}.png'
    url = f"{config['baseURL']}?{config['viewParameters']}&l={','.join(config['layers'])}&lg={config['lg']}&t={config['time']}"
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    driver.get(url)
    try:
        map_element = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, 'wv-map'))
        )
        time.sleep(5)
        map_element.screenshot(screenshot_file)
        print(f'Screenshot captured: {screenshot_file}')
    finally:
        driver.quit()
    return screenshot_file

def crop_map_area(image_path, upper_left, lower_right):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    output_path = f'cropped_map_{timestamp}.png'
    try:
        img = Image.open(image_path)
        cropped_img = img.crop((upper_left[0], upper_left[1], lower_right[0], lower_right[1]))
        cropped_img.save(output_path)
        print(f'Cropped image saved as {output_path}!')
        return output_path
    except Exception as e:
        print(f"Error during cropping: {str(e)}")
        return None

def process_image(img_path):
    min_humidity = 0
    max_humidity = 100
    img = Image.open(img_path).convert('RGB')
    img_data = np.array(img)
    pixels_rgb = img_data.reshape(-1, 3)
    avg_color_rgb = np.mean(pixels_rgb, axis=0)
    print(f"Average RGB color of the image: {avg_color_rgb}")
    pixels_lab = color.rgb2lab(pixels_rgb.reshape(-1, 1, 3) / 255.0).reshape(-1, 3)
    pixels_l = pixels_lab[:, 0]
    pixels_l_normalized = pixels_l / 100.0
    no_data_mask = np.all(pixels_rgb == [0, 0, 0], axis=1)
    pixels_l_normalized[no_data_mask] = np.nan
    humidity = min_humidity + pixels_l_normalized * (max_humidity - min_humidity)
    humidity_image = humidity.reshape(img_data.shape[:2])
    unique_humidity = np.unique(humidity[~np.isnan(humidity)])
    print(f"Unique humidity values assigned: {unique_humidity}")
    num_nans = np.isnan(humidity).sum()
    total_pixels = humidity.size
    print(f"Number of NaNs in humidity data: {num_nans} out of {total_pixels} pixels")
    avg_humidity = np.nanmean(humidity)
    if np.isnan(avg_humidity):
        print("Average humidity is NaN. This may be due to incorrect processing.")
        return None
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    json_path = f'average_humidity_{timestamp}.json'
    with open(json_path, 'w') as f:
        json.dump({'average_humidity': avg_humidity}, f)
    print(f'Average humidity saved: {json_path}')
    print(f'Average humidity: {avg_humidity}')
    return avg_humidity

if __name__ == '__main__':
    config = load_config()
    screenshot_path = capture_map_screenshot(config)
    if screenshot_path:
        map_upper_left = (449, 94)
        map_lower_right = (1713, 722)
        cropped_path = crop_map_area(screenshot_path, map_upper_left, map_lower_right)
        if cropped_path:
            avg_humidity = process_image(cropped_path)
            if avg_humidity is not None:
                print(f'Average humidity: {avg_humidity}')
            else:
                print("Failed to compute average humidity due to previous errors.")
