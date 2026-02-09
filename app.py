from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Temporary storage for form submissions
submissions = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        data = {
            "company": request.form.get("company"),
            "name": request.form.get("name"),
            "phone": request.form.get("phone"),
            "email": request.form.get("email"),
            "requirements": request.form.get("requirements"),
        }

        # Print to console (safe & simple for now)
        print("New Contact Submission:", data)

        # Store temporarily
        submissions.append(data)

        return redirect(url_for("contact"))

    return render_template("contact.html")

# ✅ NEW DEMO ROUTE
@app.route("/demo")
def demo():
    return render_template("demo.html")

if __name__ == "__main__":
    app.run(debug=True)
