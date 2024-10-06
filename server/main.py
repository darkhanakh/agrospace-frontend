from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import threading
import subprocess
import json
import os

app = FastAPI()

class ViewParams(BaseModel):
    viewParameters: str

def run_script(script_name, config_path, viewParameters):
    script_full_path = os.path.join(os.getcwd(), script_name)
    config_full_path = os.path.join(os.getcwd(), config_path)
    try:
        with open(config_full_path, 'r') as file:
            config = json.load(file)
        config['viewParameters'] = viewParameters
        with open(config_full_path, 'w') as file:
            json.dump(config, file)
        result = subprocess.run(['python', script_full_path], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return f"An error occurred while running {script_name}: {e}"
    except Exception as e:
        return f"Failed to process {script_name}: {e}"

@app.post("/process-data/")
async def process_data(params: ViewParams):
    viewParameters = params.viewParameters
    threads = []
    results = []
    scripts = [
        ("precipitation.py", "precipitation_config.json"),
        ("temperature.py", "temperature_config.json"),
        ("evi.py", "evi_config.json"),
        ("humidity.py", "humidity_config.json")
    ]
    for script, config in scripts:
        thread = threading.Thread(target=lambda s=script, c=config: results.append(run_script(s, c, viewParameters)))
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
