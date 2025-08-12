from flask import Flask, request, jsonify
from astropy.coordinates import SkyCoord, EarthLocation, AltAz, get_constellation
from astropy.time import Time
from astropy import units as u
import numpy as np
from datetime import datetime
import pytz

# Instructions to start the server:
# 1. Create and activate the virtual environment (Windows):
#    python -m venv Projects/ZenoVerse/visibilityapi
#    .\Projects\ZenoVerse\visibilityapi\Scripts\activate
#
# 2. Install required packages:
#    pip install -r requirements.txt
#
# 3. Run the API:
#    python visibility.py

# Initialize Flask application
app = Flask(__name__)

def get_constellation_bounds():
    """
    Define approximate boundaries for the 88 IAU constellations.
    Returns a dictionary with constellation names as keys and their RA/Dec boundaries as values.
    Each constellation has:
    - ra_range: Tuple of (min, max) right ascension in hours
    - dec_range: Tuple of (min, max) declination in degrees
    These are all approximates if necessary they must be reviewed and adjusted.
    """
    constellations = {
        'andromeda': {'ra_range': (22, 3), 'dec_range': (20, 50)}, 
        'antlia': {'ra_range': (9, 11), 'dec_range': (-40, -25)}, 
        'apus': {'ra_range': (14, 18), 'dec_range': (-83, -67)}, 
        'aquarius': {'ra_range': (20, 24), 'dec_range': (-25, 5)}, 
        'aquila': {'ra_range': (19, 21), 'dec_range': (-5, 15)}, 
        'ara': {'ra_range': (16.5, 18.5), 'dec_range': (-67, -45)}, 
        'aries': {'ra_range': (1.5, 3.5), 'dec_range': (10, 30)}, 
        'auriga': {'ra_range': (4.5, 7), 'dec_range': (28, 55)}, 
        'bootes': {'ra_range': (13, 16), 'dec_range': (0, 55)}, 
        'caelum': {'ra_range': (4, 5.5), 'dec_range': (-48, -27)}, 
        'camelopardalis': {'ra_range': (3, 8), 'dec_range': (60, 85)}, 
        'cancer': {'ra_range': (7.5, 9.5), 'dec_range': (5, 35)}, 
        'canes venatici': {'ra_range': (12, 14), 'dec_range': (28, 52)}, 
        'canis major': {'ra_range': (6, 7.5), 'dec_range': (-30, -10)}, 
        'canis minor': {'ra_range': (7, 8.5), 'dec_range': (-5, 10)}, 
        'capricornus': {'ra_range': (20, 22), 'dec_range': (-25, -5)}, 
        'carina': {'ra_range': (6, 11), 'dec_range': (-75, -50)}, 
        'cassiopeia': {'ra_range': (0, 3), 'dec_range': (50, 70)}, 
        'centaurus': {'ra_range': (11, 15), 'dec_range': (-65, -30)}, 
        'cepheus': {'ra_range': (21, 24), 'dec_range': (55, 85)}, 
        'cetus': {'ra_range': (0, 3), 'dec_range': (-20, 10)}, 
        'chamaeleon': {'ra_range': (7.5, 12), 'dec_range': (-83, -75)}, 
        'circinus': {'ra_range': (13.5, 15.5), 'dec_range': (-70, -55)}, 
        'columba': {'ra_range': (5, 6.5), 'dec_range': (-45, -27)}, 
        'coma berenices': {'ra_range': (11.5, 13.5), 'dec_range': (15, 35)}, 
        'corona australis': {'ra_range': (18, 19.5), 'dec_range': (-45, -35)}, 
        'corona borealis': {'ra_range': (15, 16.5), 'dec_range': (25, 40)}, 
        'corvus': {'ra_range': (12, 13), 'dec_range': (-25, -10)}, 
        'crater': {'ra_range': (10.5, 12), 'dec_range': (-25, -10)}, 
        'crux': {'ra_range': (11.5, 12.5), 'dec_range': (-65, -55)}, 
        'cygnus': {'ra_range': (19, 22), 'dec_range': (25, 60)}, 
        'delphinus': {'ra_range': (20, 21), 'dec_range': (5, 20)}, 
        'dorado': {'ra_range': (4, 6), 'dec_range': (-70, -50)}, 
        'draco': {'ra_range': (12, 20), 'dec_range': (50, 85)}, 
        'equuleus': {'ra_range': (20.5, 21.5), 'dec_range': (2, 12)}, 
        'eridanus': {'ra_range': (1, 5), 'dec_range': (-55, 0)}, 
        'fornax': {'ra_range': (2, 4), 'dec_range': (-40, -23)}, 
        'gemini': {'ra_range': (6, 8), 'dec_range': (10, 35)}, 
        'grus': {'ra_range': (21, 23.5), 'dec_range': (-55, -35)}, 
        'hercules': {'ra_range': (16, 19), 'dec_range': (15, 50)}, 
        'horologium': {'ra_range': (2, 4), 'dec_range': (-60, -40)}, 
        'hydra': {'ra_range': (8, 15), 'dec_range': (-30, 5)}, 
        'hydrus': {'ra_range': (0, 4), 'dec_range': (-80, -55)}, 
        'indus': {'ra_range': (20, 23), 'dec_range': (-75, -45)}, 
        'lacerta': {'ra_range': (22, 23), 'dec_range': (35, 55)}, 
        'leo': {'ra_range': (9, 12), 'dec_range': (0, 35)}, 
        'leo minor': {'ra_range': (9.5, 11), 'dec_range': (25, 40)}, 
        'lepus': {'ra_range': (5, 6.5), 'dec_range': (-25, -10)}, 
        'libra': {'ra_range': (14, 16), 'dec_range': (-30, 0)}, 
        'lupus': {'ra_range': (14, 16), 'dec_range': (-55, -30)}, 
        'lynx': {'ra_range': (6, 9), 'dec_range': (35, 55)}, 
        'lyra': {'ra_range': (18, 19.5), 'dec_range': (25, 45)}, 
        'mensa': {'ra_range': (4, 7.5), 'dec_range': (-85, -70)}, 
        'microscopium': {'ra_range': (20, 21.5), 'dec_range': (-45, -25)}, 
        'monoceros': {'ra_range': (6, 8.5), 'dec_range': (-10, 15)}, 
        'musca': {'ra_range': (11, 13), 'dec_range': (-75, -65)}, 
        'norma': {'ra_range': (15, 16.5), 'dec_range': (-60, -45)}, 
        'octans': {'ra_range': (0, 24), 'dec_range': (-90, -75)}, 
        'ophiuchus': {'ra_range': (16, 18.5), 'dec_range': (-25, 15)}, 
        'orion': {'ra_range': (5, 6.5), 'dec_range': (-10, 20)}, 
        'pavo': {'ra_range': (17, 21), 'dec_range': (-75, -55)}, 
        'pegasus': {'ra_range': (21, 24), 'dec_range': (0, 35)}, 
        'perseus': {'ra_range': (1, 4), 'dec_range': (30, 60)}, 
        'phoenix': {'ra_range': (23.5, 2), 'dec_range': (-55, -40)}, 
        'pictor': {'ra_range': (4.5, 6.5), 'dec_range': (-65, -45)}, 
        'pisces': {'ra_range': (22, 2), 'dec_range': (-5, 35)}, 
        'piscis austrinus': {'ra_range': (21.5, 23), 'dec_range': (-35, -20)}, 
        'puppis': {'ra_range': (6, 8.5), 'dec_range': (-50, -10)}, 
        'pyxis': {'ra_range': (8.5, 9.5), 'dec_range': (-35, -20)}, 
        'reticulum': {'ra_range': (3.5, 4.5), 'dec_range': (-65, -55)}, 
        'sagitta': {'ra_range': (19, 20.5), 'dec_range': (15, 20)}, 
        'sagittarius': {'ra_range': (17, 20), 'dec_range': (-45, -10)}, 
        'scorpius': {'ra_range': (15.5, 18), 'dec_range': (-45, -5)}, 
        'sculptor': {'ra_range': (23, 1.5), 'dec_range': (-40, -25)}, 
        'scutum': {'ra_range': (18.3, 19), 'dec_range': (-15, -5)}, 
        'serpens': {'ra_range': (15, 18), 'dec_range': (-15, 25)}, 
        'sextans': {'ra_range': (9.5, 11), 'dec_range': (-10, 5)}, 
        'taurus': {'ra_range': (3, 6), 'dec_range': (0, 30)}, 
        'telescopium': {'ra_range': (18, 20), 'dec_range': (-55, -45)}, 
        'triangulum': {'ra_range': (1.5, 2.5), 'dec_range': (25, 35)}, 
        'triangulum australe': {'ra_range': (14.5, 17), 'dec_range': (-70, -60)}, 
        'tucana': {'ra_range': (22, 1), 'dec_range': (-70, -55)}, 
        'ursa major': {'ra_range': (8, 14), 'dec_range': (30, 70)}, 
        'ursa minor': {'ra_range': (0, 24), 'dec_range': (65, 90)}, 
        'vela': {'ra_range': (8, 11), 'dec_range': (-55, -40)}, 
        'virgo': {'ra_range': (11, 15), 'dec_range': (-20, 15)}, 
        'volans': {'ra_range': (6.5, 8.5), 'dec_range': (-75, -65)}, 
        'vulpecula': {'ra_range': (19, 21), 'dec_range': (20, 30)}, 
    }
    return constellations

def is_constellation_visible(constellation_name, latitude, longitude, observation_time, min_altitude=20):
    """
    Parameters:
    - constellation_name: Name of the constellation (string)
    - latitude: Observer's latitude in degrees (float)
    - longitude: Observer's longitude in degrees (float)
    - observation_time: Time of observation (datetime object)
    - min_altitude: Minimum altitude above horizon for visibility (default 20 degrees, we can change this later)
    
    Returns:
    - Boolean: True if constellation is visible, False otherwise
    """
    
    # Get constellation boundaries
    constellations = get_constellation_bounds()
    constellation_lower = constellation_name.lower().strip()
    
    if constellation_lower not in constellations:
        return False, f"Constellation '{constellation_name}' not found in database"
    
    # Get constellation data
    const_data = constellations[constellation_lower]
    
    # Create observer location
    location = EarthLocation(lat=latitude*u.deg, lon=longitude*u.deg)
    
    # Convert time to astropy Time object
    time = Time(observation_time)
    
    # Create coordinate frame for the observer
    altaz_frame = AltAz(obstime=time, location=location)
    
    # Sample points within the constellation boundaries
    ra_min, ra_max = const_data['ra_range']
    dec_min, dec_max = const_data['dec_range']
    
    # Handle wrap-around for RA (like Andromeda spanning 22h to 3h)
    if ra_min > ra_max:
        ra_points = np.concatenate([
            np.linspace(ra_min, 24, 5),
            np.linspace(0, ra_max, 5)
        ])
    else:
        ra_points = np.linspace(ra_min, ra_max, 10)
    
    dec_points = np.linspace(dec_min, dec_max, 10)
    
    # Check visibility of sample points
    visible_points = 0
    total_points = 0
    
    for ra in ra_points:
        for dec in dec_points:
            # Create sky coordinate
            coord = SkyCoord(ra=ra*u.hour, dec=dec*u.deg, frame='icrs')
            
            # Transform to horizontal coordinates
            altaz_coord = coord.transform_to(altaz_frame)
            
            # Check if above minimum altitude
            if altaz_coord.alt.deg >= min_altitude:
                visible_points += 1
            total_points += 1
    
    # Constellation is considered visible if at least 30% of sample points are visible
    visibility_ratio = visible_points / total_points if total_points > 0 else 0
    is_visible = visibility_ratio >= 0.2
    
    return is_visible, f"Visibility ratio: {visibility_ratio:.2f}"

@app.route('/')
def home():
    """
    Home endpoint with API documentation
    """
    return """
    <h1>Constellation Visibility API</h1>
    <h2>Usage:</h2>
    <p>POST /api/constellation-visibility</p>
    <h3>Parameters:</h3>
    <ul>
        <li><strong>constellation</strong>: Name of the constellation (e.g., "Orion", "Ursa Major")</li>
        <li><strong>latitude</strong>: Observer's latitude in degrees (-90 to 90)</li>
        <li><strong>longitude</strong>: Observer's longitude in degrees (-180 to 180)</li>
        <li><strong>timestamp</strong>: UNIX timestamp in seconds (e.g., 1710537600)</li>
    </ul>
    
    <h3>Available Constellations:</h3>
    <p>All 88 IAU recognized constellations are supported, including: Andromeda, Antlia, Apus, Aquarius, Aquila, Ara, Aries, Auriga, Bootes, Caelum, Camelopardalis, Cancer, Canes Venatici, Canis Major, Canis Minor, Capricornus, Carina, Cassiopeia, Centaurus, Cepheus, Cetus, Chamaeleon, Circinus, Columba, Coma Berenices, Corona Australis, Corona Borealis, Corvus, Crater, Crux, Cygnus, Delphinus, Dorado, Draco, Equuleus, Eridanus, Fornax, Gemini, Grus, Hercules, Horologium, Hydra, Hydrus, Indus, Lacerta, Leo, Leo Minor, Lepus, Libra, Lupus, Lynx, Lyra, Mensa, Microscopium, Monoceros, Musca, Norma, Octans, Ophiuchus, Orion, Pavo, Pegasus, Perseus, Phoenix, Pictor, Pisces, Piscis Austrinus, Puppis, Pyxis, Reticulum, Sagitta, Sagittarius, Scorpius, Sculptor, Scutum, Serpens, Sextans, Taurus, Telescopium, Triangulum, Triangulum Australe, Tucana, Ursa Major, Ursa Minor, Vela, Virgo, Volans, Vulpecula</p>
    """

@app.route('/api/constellation-visibility', methods=['POST'])
def check_constellation_visibility():
    """
    API endpoint to check constellation visibility
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required parameters
        required_params = ['constellation', 'latitude', 'longitude', 'timestamp']
        for param in required_params:
            if param not in data:
                print(f"Missing required parameter: {param}")
                return jsonify({
                    'error': f'Missing required parameter: {param}',
                    'visible': False
                }), 400
        
        # Extract parameters
        constellation = data['constellation']
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])
        timestamp = data['timestamp']
        min_altitude = float(data.get('min_altitude', 20))
        
        # Validate coordinate ranges
        if not (-90 <= latitude <= 90):
            print(f"Invalid latitude: {latitude}")
            return jsonify({
                'error': 'Latitude must be between -90 and 90 degrees',
                'visible': False
            }), 400
            
        if not (-180 <= longitude <= 180):
            print(f"Invalid longitude: {longitude}")
            return jsonify({
                'error': 'Longitude must be between -180 and 180 degrees',
                'visible': False
            }), 400
        
        # Parse timestamp to UTC datetime
        try:
            dt = datetime.fromisoformat(timestamp)
        except Exception as e:
            print(f"Invalid timestamp format: {timestamp}")
            return jsonify({
                'error': f'Invalid timestamp: {str(e)}',
                'visible': False
            }), 400
        
        # Check constellation visibility
        is_visible, details = is_constellation_visible(
            constellation, latitude, longitude, dt, min_altitude
        )
        
        # Prepare response
        response = {
            'visible': is_visible,
            'constellation': constellation.title(),
            'location': {
                'latitude': latitude,
                'longitude': longitude
            },
            'observation_time': dt.isoformat(),
            'timezone': str(dt.tzinfo),
            'min_altitude': min_altitude,
            'details': details
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(e)
        return jsonify({
            'error': f'Internal server error: {str(e)}',
            'visible': False
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)