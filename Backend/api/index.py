from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        if self.path == '/health':
            response = {"status": "healthy"}
        else:
            response = {"message": "Las Torres FC API", "status": "online"}
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
        return
