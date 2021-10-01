"3.0 m/s, 45 deg and 5.0 m/s, 135 deg"
"5.0 m/s, 45 deg and 2.0 m/s, 180 deg"
"4.0 m/s, 135 deg and 4.0 m/s, 315 deg"
"6.0 m/s, 225 deg and 2.0 m/s, 90 deg"

let VectorEquationToSolve = "2.0 m/s, 150 deg and 4.0 m/s, 225 deg"

class VectorComponents {
    constructor(props) {
        this.x = props ? props.x : null,
            this.y = props ? props.y : null
    }
}

class VectorMagnitude {
    constructor(props) {
        this.amount = props ? props.amount : null,
            this.units = props ? props.units : null
    }
}

class Vector {
    constructor(props) {
        this.components = new VectorComponents(props.components),
            this.magnitude = new VectorMagnitude(props.magnitude),
            this.degrees = props ? props.degrees : null
    }
}

function sin(angle) {
    return Math.sin(angle * Math.PI / 180);
};

function cos(angle) {
    return Math.cos(angle * Math.PI / 180);
};

function round(value, decimalPlaces) {
    decimalPlaces = Number(`1` + `0`.repeat(decimalPlaces - 1))
    return Math.round(value * decimalPlaces) / decimalPlaces
}

function ParseVectors(vecq) {
    let splitVectors = vecq.split(" and ")

    // for each vector, parse
    let VectorsArray = []

    splitVectors.forEach(vector => {
        let splitTerms = vector.split(", ")
        let magnitudeObject = {}
        let degrees = null

        splitTerms.forEach((term, idx) => {
            let splitUnits = term.split(" ");

            splitUnits.forEach((unit, uidx) => {

                if (idx === 0) {
                    uidx === 0 ? magnitudeObject.amount = Number(unit) : magnitudeObject.units = unit
                } else {
                    if (uidx === 0) {
                        degrees = Number(unit)
                    }
                }
            })
        })
        VectorsArray.push(new Vector({ magnitude: magnitudeObject, degrees: degrees }))
    })

    return VectorsArray
}

function EvaluateComponents(vector) {

    let aAngle = vector.degrees
    let computeAngle = aAngle
    let amount = vector.magnitude.amount

    if (90 < vector.degrees && vector.degrees < 270) {
        computeAngle = Math.abs(180 - aAngle)
    } else if (270 < vector.degrees && vector.degrees < 360) {
        computeAngle = Math.abs(360 - aAngle)
    }

    let yComponent = sin(computeAngle) * amount
    let xComponent = cos(computeAngle) * amount

    if (90 < aAngle && aAngle <= 180) {
        xComponent = -(xComponent)
    } else if (180 < aAngle && aAngle < 270) {
        xComponent = -(xComponent)
        yComponent = -(yComponent)
    } else if (270 < aAngle && aAngle < 360) {

        yComponent = -(yComponent)
    }

    vector.components = new VectorComponents({ x: xComponent, y: yComponent })
    return vector

}

function CalculateVector(Vectors) {
    let RVectorX = Vectors[0].components.x + Vectors[1].components.x
    let RVectorY = Vectors[0].components.y + Vectors[1].components.y

    let RVectorMagnitudeUnits = Vectors[0].magnitude.units
    let RVectorMagnitude = Math.sqrt((RVectorX ** 2) + (RVectorY ** 2))
    console.log(RVectorX, RVectorY, RVectorMagnitude, RVectorMagnitudeUnits)
    let RVectorAngle = (Math.asin((RVectorY / RVectorMagnitude)) * 180) / Math.PI

    return new Vector(
        {
            components: new VectorComponents({ x: RVectorX, y: RVectorY }),
            magnitude: new VectorMagnitude({ amount: RVectorMagnitude, units: RVectorMagnitudeUnits }),
            degrees: RVectorAngle
        }
    )

}

function FormatVector(vector) {
    return `To balance the forces, place the vector at ${isNaN(round(vector.degrees, 3)) ? 0 : round(vector.degrees, 3)}° with a ${vector.magnitude.unit === "m/s" || vector.magnitude.unit === "N" ? "force" : "mass"} of ${round(vector.magnitude.amount, 2)} ${vector.magnitude.units}.`
}

async function solve(vecq) {

    let Vectors = ParseVectors(vecq)

    // calculate components
    Vectors.forEach((vector, idx) => {
        Vectors[idx] = EvaluateComponents(vector);
    })

    console.log(Vectors)

    // now we calculate the new vector as a result of the two vectors
    let ResultantVector = CalculateVector(Vectors)
    console.log(ResultantVector)
    // format
    return console.log(FormatVector(ResultantVector))

}

solve(VectorEquationToSolve)